import { NextFunction, Request, Response } from 'express';
import DocumentType from '../models/document-type';
import { responseFormatter, CODE, SUCCESS } from '../config/response';
import MESSAGE from '../config/message.json';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { businessTransactionId } = req.params;
    const documentTypes = await DocumentType.findAll({
      where: { businessTransactionId },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      documentTypes,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

const getExpensesDocumentTypes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const documentTypes = await DocumentType.findAll({
      where: {
        documentType: ['KR', 'KG'],
      },
    });
    const response = responseFormatter(
      CODE[200],
      SUCCESS.TRUE,
      MESSAGE.FETCHED,
      documentTypes,
    );
    res.status(CODE[200]).send(response);
  } catch (err) {
    next(err);
  }
};

export default { findAll, getExpensesDocumentTypes };
