import { Task } from '../../core/task';
import { Category } from '../../core/category';
import { Comment } from '../../core/comment';
import { User } from '../../core/user';

type Entity = User |Task | Category | Comment;

export const convertEntityDates = (entity: Entity): Entity => {
  // @ts-ignore
  const { expires = '', createdAt = '', updatedAt = '' } = entity;

  if (expires.length) {
    // @ts-ignore
    entity.expires = new Date(expires);
  }
  if (createdAt.length) {
    // @ts-ignore
    entity.createdAt = new Date(createdAt);
  }
  if (updatedAt.length) {
    // @ts-ignore
    entity.updatedAt = new Date(updatedAt);
  }

  return entity;
};
