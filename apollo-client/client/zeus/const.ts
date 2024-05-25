/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		getUserById:{

		}
	},
	CreateUserInput:{

	},
	Mutation:{
		createUser:{
			input:"CreateUserInput"
		}
	}
}

export const ReturnTypes: Record<string,any> = {
	User:{
		id:"ID",
		name:"String",
		email:"String"
	},
	Query:{
		getUserById:"User",
		getAllUsers:"User"
	},
	Mutation:{
		createUser:"User"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}