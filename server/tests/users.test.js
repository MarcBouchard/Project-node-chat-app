const expect = require('expect')

const Users = require('../utils/users')

describe('Users', () => {
	let seedUsers

	beforeEach(() => {
		seedUsers = new Users()
		seedUsers.users = [{
			id: '1',
			name: 'Mike',
			room: 'NodeJS Fans',
		}, {
			id: '2',
			name: 'Joe',
			room: 'ReactJS Fans',
		}, {
			id: '3',
			name: 'Julie',
			room: 'NodeJS Fans',
		}]
	})

	it('should add new user', () => {
		const newUsers = new Users()
		const user = {
			id: '123',
			name: 'Marc',
			room: 'The Office Fans',
		}
		const resUser = newUsers.addUser(user.id, user.name, user.room)

		expect(newUsers.users).toEqual([user])
	})

	it('should remove a user', () => {
		const userId = '1'
		const user = seedUsers.removeUser(userId)

		expect(user.id).toBe(userId)
		expect(seedUsers.users.length).toBe(2)

	})

	it('should not remove user', () => {
		const userId = '99'
		const user = seedUsers.removeUser(userId)

		expect(user).toBeUndefined()
		expect(seedUsers.users.length).toBe(3)

	})

	it('should find user', () => {
		const userId = '1'
		const user = seedUsers.getUser(userId)

		expect(user.id).toBe(userId)
	})

	it('should not find user', () => {
		const userId = '99'
		const user = seedUsers.getUser(userId)

		expect(user).toBeUndefined()
	})

	it('should return names for node course', () => {
		const userList = seedUsers.getUserList('NodeJS Fans')

		expect(userList).toEqual(['Mike', 'Julie'])
	})

	it('should return names for react course', () => {
		const userList = seedUsers.getUserList('ReactJS Fans')

		expect(userList).toEqual(['Joe'])
	})

})
