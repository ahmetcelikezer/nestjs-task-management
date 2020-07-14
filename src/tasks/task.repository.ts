import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.user = :userID', { userID: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }

    try {
      return await query.getMany();
    } catch (exception) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters ${JSON.stringify(filterDto)}`, exception.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();

    task.title = title;
    task.user = user;
    task.description = description;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (exception) {
      this.logger.error(`Failed to create task for user "${user.username}". Data: ${createTaskDto}`, exception.stack);
      throw new InternalServerErrorException();
    }
    delete task.user;

    return task;
  }
}
