[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][license-href]

<h1 align="center">Missing Native
	<img width="24" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" />
	Syntax</h1>
<p align="center">A small JavaScript utility library delivering <b>missing</b> native syntax, using a TypeScript transformer and bundling plugins</p>


This repository contains a collection of missing native JavaScript syntax additions. The syntax is implemented as a TypeScript transformer and as a Babel plugin.

## Installation

```sh

# Using npm
npm install missing-native-js-syntax

# Using yarn
yarn add missing-native-js-syntax
```

### TypeScript

#### Add this plugin to your `tsconfig.json` file


```json
{
  "compilerOptions": {
    "plugins": [
      { "transform": "missing-native-js-syntax", "transformProgram": true },
      { "transform": "missing-native-js-syntax" }
    ]
  }
}
```

To add syntax highlighting support in your editor, you need to use the TypeScript version of your project. If you are using VSCode, you can open the command palette (<kbd>Ctrl+Shift+P</kbd> or <kbd>F1</kbd>) and choose `TypeScript: Select TypeScript Version`. Then click `Use Workspace Version`.

## Usage

### if-return

#### Example

The `createUser` function is responsible for the creation of a new user. It accepts a user object as input and verifies the existence of the user (or an admin) in the system. If the user (or an admin) is found, the function returns the existing record; otherwise, it adds the user to the users array and returns the newly created user.

```js
const users = [
	{ name: "John", age: 25, type: "admin" },
	{ name: "Jane", age: 30, type: "user" },
	{ name: "Jack", age: 28, type: "user" },
];

function createUser(user) {
	const exists = users.find((u) => u.name === user.name);
	if (exists) return exists;

	const adminExists = users.find((u) => u.type === "admin");
	if (adminExists && user.type === "admin") return adminExists;

	users.push(user);

	return user;
}
```

To improve code readability, the early if-return pattern can be employed. By using this pattern, the function will return the value if it is truthy, else it will proceed with the execution.
The new `createUsers` function immediately returns the existing (admin) user if it is found, else it adds and returns the new user.

```js
function createUser(user) {
	if return users.find((u) => u.name === user.name);
	if return user.type == "admin" && users.find((u) => u.type === "admin");

	users.push(user);

	return user;
}
```

### Defer

#### Example

<!-- database/file closing -->

```js
function getUserRoles(name) {
	const handle = openDatabase();
	var user, roles;
	// a database join would be better, but this is just an example to demonstrate why defer is needed

	try {
		user = db.execute("SELECT * FROM users WHERE name = ?", user.name);
	} catch (e) {
		handle.close();
		throw new Error("Database connection error");
	}

	if (!user) {
		handle.close();

		throw new Error("User not found");
	}

	try {
		roles = db.execute("SELECT * FROM roles WHERE user_id = ?", user.id);
	} catch (e) {
		handle.close();
		throw new Error("Database connection error");
	}

	handle.close();

	return roles;
}
```

The `getUserRoles` function is responsible for retrieving the roles of a user. It accepts a user name as input and gets the user from the database. If the user is found, it gets the roles of the user from the database and returns them. If the user is not found it throws a User not found error and if there is a database connection error it throws a Database connection error.

```js
function getUserRoles(path) {
	const handle = openDatabase(path);

	defer {
		handle.close();
	}

	try {
		const user = db.executeSql("SELECT * FROM users WHERE id = ?", user.id);
	} catch (e) {
		throw new Error("Database connection error");
	}

	if (!user) throw new Error("User not found");

	try {
		return db.executeSql("SELECT * FROM roles WHERE user_id = ?", user.id);
	} catch (e) {
		throw new Error("Database connection error");
	}
}
```

To enhance code readability and ensure proper resource management, the defer pattern can be implemented. This approach allows the createUsers function to automatically close the database connection when it returns, regardless of whether it completes successfully or throws an error. By using the defer pattern, you can defer (delay) the execution of a statement until the surrounding function returns.

### Match

_TODO_

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/missing-native-js-syntax/latest.svg
[npm-version-href]: https://npmjs.com/package/missing-native-js-syntax
[npm-downloads-src]: https://img.shields.io/npm/dt/missing-native-js-syntax.svg
[npm-downloads-href]: https://npmjs.com/package/missing-native-js-syntax
[github-actions-ci-src]: https://github.com/intevel/missing-native-js-syntax/actions/workflows/ci.yml/badge.svg
[github-actions-ci-href]: https://github.com/intevel/missing-native-js-syntax/actions?query=workflow%3Aci
[license-src]: https://img.shields.io/npm/l/missing-native-js-syntax.svg
[license-href]: https://npmjs.com/package/missing-native-js-syntax