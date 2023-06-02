import { NextFunction, Request, Response } from 'express';
import PostingKey from '../models/posting-key';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postingKeys = await PostingKey.findAll({
      attributes: [
        'id',
        'postingKey',
        'description',
        'accountType',
        'groupName',
      ],
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      postingKeys,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll };
