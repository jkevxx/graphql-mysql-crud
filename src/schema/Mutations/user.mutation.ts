import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';

import { User } from '../../entity/User';
import { UserType } from '../typeDefs/User.type';

import bcrypt from 'bcryptjs';
import { MessageType } from '../typeDefs/message.type';

export const CREATE_USER = {
  type: UserType,
  args: {
    name: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  resolve: async (_: any, args: any) => {
    const { name, username, password } = args;

    const encryptPassword = await bcrypt.hash(password, 10);

    const result = await User.insert({
      name: name,
      username: username,
      password: encryptPassword,
    });

    // console.log(result);

    return { ...args, id: result.identifiers[0].id, password: encryptPassword };
  },
};

export const DELETE_USER = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (_: any, { id }: any) => {
    const result = await User.delete(id);
    if (result.affected === 1) return true;

    return false;
  },
};

export const UPDATE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    input: {
      type: new GraphQLInputObjectType({
        name: 'UserInput',
        fields: {
          name: { type: GraphQLString },
          username: { type: GraphQLString },
          oldPass: { type: GraphQLString },
          newPass: { type: GraphQLString },
        },
      }),
    },
  },
  resolve: async (_: any, { id, input }: any) => {
    const userFound = await User.findOne({ where: { id } });
    if (!userFound)
      return {
        success: false,
        message: 'User not found',
      };

    const isMatch = await bcrypt.compare(input.oldPass, userFound.password);
    if (!isMatch)
      return {
        success: false,
        message: 'Wrong password',
      };

    const newPassEncrypted = await bcrypt.hash(input.newPass, 10);

    const response = await User.update(
      { id },
      { name: input.name, username: input.username, password: newPassEncrypted }
    );

    if (response.affected === 0)
      return { success: false, message: 'User not updated' };

    return {
      success: true,
      message: 'User updated successfully',
    };
  },
};
