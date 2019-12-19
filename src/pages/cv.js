import React from "react";
import styled from "styled-components";

import Layout from "../templates/layout";
import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import P from "../components/P";

const Title = styled(H1)`
  margin-left: 10px;
  text-align: left;
  padding: 0;
`;

const Subtitle = styled(H2)`
  margin-left: 10px;
`;

const Text = styled(P)`
  margin-left: 10px;
  margin-bottom: 50px;
  text-align: left;
  margin-top: ${p => p.mt} !important;
  margin-bottom: ${p => p.mb} !important;
`;

const TagsList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Tag = styled.li`
  padding: 5px 15px;
  color: ${props => props.color || "inherit"};
  border: 1px solid ${props => props.color || "inherit"};
  border-radius: 20px;
  font-size: 14px;
  list-style: none;
  transition: 0.5s background-color ease;
  cursor: default;
  margin: 5px;
  &:hover {
    color: #fff;
    background-color: ${props => props.color || "inherit"};
  }
`;

const List = styled.ul`
  * {
    font-size: 16px !important;
    color: #3e465b;
  }

  > li > p:first-child {
    font-weight: bold;
  }
`;

const CV = () => {
  return (
    <Layout>
      <Container>
        <Title>Profile</Title>
        <Text>
          Full Stack Web Developer with 3+ years of experience and Junior Devops
          Engineer. Passionate about learning new technologies that ease the
          life of both the developer and the customer.
        </Text>
        <Title>Work Experience</Title>
        <>
          <Subtitle>Devops Engineer - Lableb (2019/06/01 - Now)</Subtitle>
          <TagsList>
            <Tag title="Operating System" color="#DD4814">
              Ubuntu
            </Tag>
            <Tag title="App Containeriziation Tool" color="#2496EE">
              Docker
            </Tag>
            <Tag title="Programming Language" color="#2B3539">
              Shell Scripting
            </Tag>
            <Tag title="Container Orchestration Tool" color="#2496EE">
              Docker Swarm
            </Tag>
            <Tag title="Monitoring Tool" color="#F15A29">
              Prometheus
            </Tag>
            <Tag title="CI / CD Tool" color="#FCA326">
              GitlabCI
            </Tag>
          </TagsList>
          <Text mt="10px" mb="10px">
            I took several Devops-ish and System administration tasks involving
            configuring firewalls on the server and securing them begind a VPN.
            Creating a local NAS. Automating backups...
          </Text>
          <Text mt="10px" mb="10px">
            I re-deployed Lableb Search Engine using Docker Swarm.
          </Text>
          <Text mt="10px">
            I set up Prometheus to monitor servers' and other apps'
            performances.
          </Text>
        </>

        <>
          <Subtitle>
            Full Stack Web Developer - Lableb (2018/02/01 - Now)
          </Subtitle>
          <TagsList>
            <Tag title="Javscript Runtime" color="#8BC500">
              Node.js
            </Tag>
            <Tag title="UI Library" color="#53C1DE">
              React.js
            </Tag>
            <Tag title="Programming Language" color="#777BB3">
              PHP
            </Tag>
            <Tag title="Content Managment System" color="#464646">
              WordPress
            </Tag>
          </TagsList>
          <Text mt="10px" mb="10px">
            I built JSON APIs for Lableb Search Engines and other services the
            company provieded. I built a Javascript SDK for the Lableb Cloud
            Search API and I built most of the frontend projects like the search
            engine dashboard, cloud search docs...
          </Text>
          <Text mt="10px" mb="10px">
            I built a WordPress and Magento 2 plugins for Lableb Cloud Search
            service and I built a PHP SDK for it.
          </Text>
          <Text mt="10px">
            I set up Prometheus to monitor servers' and other apps'
            performances.
          </Text>
        </>

        <>
          <Subtitle>
            Full Stack Web Developer - VascularIO (2017/08/01 - 2020/01/01)
          </Subtitle>
          <TagsList>
            <Tag title="Cloud Provider" color="#EC912D">
              AWS
            </Tag>
            <Tag title="Javscript Runtime" color="#8BC500">
              Node.js
            </Tag>
            <Tag title="UI Library" color="#53C1DE">
              React.js
            </Tag>
            <Tag title="Json API Querying Language" color="#E535AB">
              GraphQL
            </Tag>
            <Tag title="Mobile App Development Library" color="#61DAFB">
              React Native
            </Tag>
            <Tag title="CI/CD Tool" color="#161616">
              CircleCI
            </Tag>
            <Tag title="Programming Language" color="#53C1DE">
              Golang
            </Tag>
            <Tag title="App Containerization Tool" color="#2496EE">
              Docker
            </Tag>
            <Tag title="Ecommerce Platform" color="#96BF48">
              Shopify
            </Tag>
          </TagsList>
          <Text mt="10px" mb="10px">
            VascularIO automates build a mobile app for customers who have a
            Shopify store.
          </Text>
          <Text mt="10px" mb="10px">
            I built the app dashboard and contributed to the backend JSON API.
          </Text>
          <Text mt="10px" mb="10px">
            I built the pipeline which automates building the Android App and
            publishes it on Google Play.
          </Text>
          <Text mt="10px" mb="10px">
            I built AWS Lambdas that authorizes our app on Shopify stores.
          </Text>
          <Text mt="10px">
            I build the mobile app using React Native and GraphQL.
          </Text>
        </>
        <Title>Skills</Title>
        <List>
          <li>
            <Text mt="10px" mb="10px">
              Backend Development
            </Text>
            <Text mb="10px" mt="0">
              Node.js, Express, Mocha, Chai, GraphQL, Apollo, MongoDB,
              Sequelize, Mongoose, MySQL, Json Web Tokens.
            </Text>
          </li>
          <li>
            <Text mt="10px" mb="10px">
              Frontend Development
            </Text>
            <Text mb="10px" mt="0">
              React.js, Redux, Mobx, Umi & Dva, Apollo Client, Styled
              Components, Formik, Webpack, Gulp, Grunt.
            </Text>
          </li>
          <li>
            <Text mt="10px" mb="10px">
              System Administration & Devops Engineering
            </Text>
            <Text mb="10px" mt="0">
              Linux (Ubuntu), Docker, Docker Swarm, Iptables, GitlabCI,
              CircleCI, Prometheus, Fastlane.
            </Text>
          </li>
          <li>
            <Text mt="10px" mb="10px">
              Clean Code & Design Patterns
            </Text>
            <Text mb="10px" mt="0">
              Familiar with design patterns and best practices.
            </Text>
          </li>
          <li>
            <Text mt="10px" mb="10px">
              Other Skills
            </Text>
            <Text mt="0">
              Familiar with version management tools such as Git, some of AWS
              services and WordPress plugin development.
            </Text>
          </li>
        </List>
        <Title>Education</Title>
        <List>
          <li>
            <Text mb="10px" mt="10px">
              Information Technology Engineering - Damasuc University (2016 -
              2021)
            </Text>
          </li>
        </List>
        <Title>Hoppies</Title>
        <List>
          <li>Cooking</li>
        </List>
        <Title>Contact</Title>
        <List>
          <li>
            <a href="mailto:richardeo112@gmail.com">richardeo112@gmail.com</a>
          </li>
          <li>
            <a href="https://rashadkokash.me">Blog</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/rashad-kokash-847746160/">
              Linkedin
            </a>
          </li>
          <li>
            <a href="https://github.com/FrankenSteinxD">Github</a>
          </li>
          <li>(+963) 997818035</li>
        </List>
      </Container>
    </Layout>
  );
};

export default CV;
