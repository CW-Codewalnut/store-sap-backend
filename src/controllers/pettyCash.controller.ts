import { NextFunction, Request, Response } from 'express';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import PettyCash from '../models/petty-cash';

const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pettyCashBody = req.body;
    pettyCashBody.postingDate = new Date(pettyCashBody.postingDate).toISOString();
    pettyCashBody.documentDate = new Date(pettyCashBody.documentDate).toISOString();
    pettyCashBody.referenceDate = pettyCashBody.referenceDate ? new Date(pettyCashBody.referenceDate).toISOString(): null;
    pettyCashBody.createdBy = req.user.id;
    pettyCashBody.updatedBy = req.user.id;
    const pettyCashResult = await PettyCash.create(pettyCashBody);
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      pettyCashResult,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};
const findWithPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};
const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {transactionId} =  req.params;
    const pettyCashBody = req.body;
    pettyCashBody.postingDate = new Date(pettyCashBody.postingDate).toISOString();
    pettyCashBody.documentDate = new Date(pettyCashBody.documentDate).toISOString();
    pettyCashBody.referenceDate = pettyCashBody.referenceDate ? new Date(pettyCashBody.referenceDate).toISOString(): null;
    const transactionData = await PettyCash.findOne({where: {id: transactionId, documentStatus: 'Save'}});
    if(!transactionData) {
      const response = responseFormatter(
        CODE[400],
        SUCCESS.FALSE,
        'Update not allowed',
        null,
      );
      return res.status(CODE[400]).send(response);
    }
    const isUpdated = await PettyCash.update(pettyCashBody, {where: {id: transactionId}});
    console.log('ddddd=> ', isUpdated)
    const pettyCashResult = await PettyCash.findOne({where: {id: transactionId}});
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      pettyCashResult,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

const exportPettyCash = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      'Fetched',
      null,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    next(err);
  }
};

export default { create, findWithPaginate, update, exportPettyCash };
