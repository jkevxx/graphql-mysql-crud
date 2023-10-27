```graphql
query {
  getAllUsers {
    id
    name
    username
    password
  }
}
```

```graphql
mutation {
  createUser(name: "Keitaro", username: "keitaro-sh", password: "kei") {
    name
    id
    password
  }
}
```

```graphql
query {
  getUser(id: 6) {
    id
    name
    password
  }
}
```

```graphql
mutation {
  updateUser(
    id: 4
    input: {
      name: "Kevin"
      username: "jkevxx"
      oldPass: "jkevxx"
      newPass: "pass"
    }
  ) {
    success
    message
  }
}
```
