#!/usr/bin/env node

import { findUserByEmail, getUsers } from './api/lib/users.js';

console.log('🔍 All users:');
const users = getUsers();
console.log(JSON.stringify(users, null, 2));

console.log('\n🔍 Demo user:');
const user = findUserByEmail('demo@example.com');
console.log(JSON.stringify(user, null, 2));
