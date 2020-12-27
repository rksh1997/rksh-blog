---
title: Building framework independent, database agnostic web application (Node.js)
date: "2020-12-27"
---

We need this mainly for two reasons:
1. Being able to mock functionalities in tests. So for example I can mock the database and not connect to a real database in tests.
2. Being able to refactor and adapt better technologies in the future.

## Introduction
I am going to prove this concept by implementing a small todo app, well, a part of it because all the other functionalities will follow the same implementation way.

I am going to implement the `create todo` functionality and maybe discuss the other functionalities.

**NOTE**:
I am going to go simple but of course there are more to do if you want to build an enterprise level application.

## 3 Layers
- **Repository**: which is a layer that will abstract the interaction with the database, so we're not tightly coupled to MongoDB or MySQL.
- **Usecases**: which is a layer that will execute the business logic. And it will benifit from the **Repository** layer to persist data.
- **Controller**: which is a layer that will abstract the http requests and reponses, checks for permissions and validate user input. And it will execute the **Usecases**.

### The Repository
The repository is just an interface that will abstract the interaction with the database, so for example, in our todo app we need 4 functionalities:
- List todos
- Create a todo
- Update a todo
- Delete a todo

And for simplicity, let's assume our todos will only containt the todo title, its ID and nothing else. So first of all let's declare the Todo schema.

```ts
interface ITodoSchema {
  _id: string;
  title: string;
}
```

And our repository interface will abstract the 4 functionalities above like this:
```ts
interface ITodoRepository {
  listTodos(): Promise<ITodoSchema[]>;
  createTodo(todo: ITodoSchema): Promise<boolean>;
  updateTodo(todo: ITodoSchema): Promise<boolean>;
  deleteTodo(todoId: string): Promise<boolean>;
}
```

### The Usecase
A usecase is just class that will take some input, executes a functionality of our app and return some output.

A usecase will not execute the logic if it will break the domain rules. So for example a usecase for registering users will not allow multiple users with the same email.

Let's declare an interface for the usecase so that all of our usecase classes implement it.

```ts
interface IUsecase<Input, Output> {
  execute(input: Input): Output;
}
```

And as I mentioned above, I will only implement the `create todo` functionality. So let's do it.

First of all, to create a new todo we need its ID and its title. We will get the title from the usecase input and we will generate the id. The usecase will then return a todo (ITodoSchema) as an output.

This usecase needs to persist the new todo in the database so we will inject the todo repository in its constructor.

```ts
interface CreateTodoUsecaseInput {
  title: string;
}

class CreateTodoUsecase implements IUsecase<CreateTodoUsecaseInput, Promise<ITodoSchema>> {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(input: CreateTodoUsecaseInput): Promise<ITodoSchema> {
    const newTodo: ITodoSchema = {
      _id: generateSomeUniqueId(),
      title: input.title
    }

    await this.todoRepository.createTodo(newTodo);

    return newTodo;
  }
}
```

As you can see the usecase never knows about mongo or mysql nor it knows about http (because we might need to do a CLI version of our app).

I simply depends on an interface of the todos repository and doesn't know anything about the repository actual implemention.


### The Controller
In this article, the aim of the controller is just to abstract the interaction with the web. So the controller will never know if it's being called from a REST api, Graphql or AWS Lambda. It gets a standard http request and will return a standard http response.

First of all, let's abstract the http request and response and write an interface for the controller.

```ts
interface IHTTPRequest {
  headers: Record<string, string>;
  body: any;
}

interface IHTTPResponse {
  statusCode: number;
  response: any;
  headers?: Record<string, string>;
}

interface IController {
  execute(request: IHTTPRequest): Promise<IHTTPResponse>;
}
```

And as we said before, the controller will validate the input and pass it to the usecase layer to execute the business logic.

And again we will inject the usecase in its constructor.

```ts
class CreateTodoController implements IController {
  private createTodo: CreateTodoUsecase;

  constructor(createTodo: CreateTodoUsecase) {
    this.createTodo = createTodo;
  }

  async execute(request: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      if (!isValid(request.body)) {
        return {
          statusCode: 400,
          response: {
            error: 'Invalid input'
          }
        }
      }

      const createTodoInput: CreateTodoUsecaseInput = {
        title: request.body.title
      }

      const todo = await this.createTodo.execute(createTodoInput);

      return {
        statusCode: 201,
        response: {
          data: todo
        }
      }
    } catch (e) {
      return {
        statusCode: 500,
        response: {
          error: 'Something wrong happened'
        }
      }
    }
  }
}
```

### Putting it all together
So far we have an implementation of the controller, the usecase but not the repository. So let's implement a MongoDB implementation of it.

```ts
class MongoDBTodoRepository implements ITodoRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async createTodo(todo: ITodoSchema): Promise<boolean> {
    const { insertedCount } = await this.db.collection('todos').insertOne(todo);

    return insertedCount > 0;
  }

  // ..... Rest of the methods
}
```

What we can do now is instantiate a repository, suply it to the usecase which we will suply to the controller and then use the controller with whatever framework we want.

```ts
import db from './db'

const todoRepository = new MongoDBTodoRepository(db);
const createTodoUsecase = new CreateTodoUsecase(todoRepository);
const createTodoController = new CreateTodoController(createTodoUsecase);
```


**With Express**:
```ts
const app = express()
app.post('/api/v1/todos', (req, res) => {
  try {
    const request = {
      headers: req.headers as any,
      body: req.body
    }

    const response = await createTodoController.execute(request);
    
    res.status(response.statusCode).json(response.response);
  } catch (e) {
    res.status(500).json({
      error: 'Something wrong happened'
    });
  }
});
```


**With AWS Lambda**:
```ts
export default (event) => {
  try {
   const request = {
      headers: event.headers,
      body: event.body
    }

    const response = await createTodoController.execute(request);

    return {
      statusCode: response.statusCode,
      body: JSON.stringify(response.response)
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Something wrong happened'
      });
    }
  }
}
```

## Conclusion
As you can see we were able to use the same code with express and aws lamda, and you can implement an adapter for each so that you don't repeat the same adaptation code again.

And we are not coupled to MongoDB, when you need to move to SQL, simply implement an SQL version of `ITodoRepository` and supply it to your usecases.

But anyway. I went very simple in this app just to provide a proof of concept and of course there a lot more to add.

**AND PLEASE DON'T OVERENGINEER SIMPLE AND SMALL APPS**


## References
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Domain Driven Desing](https://www.youtube.com/watch?v=pMuiVlnGqjk)