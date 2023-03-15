import {Request, Response} from 'express';
import GlAccount from '../models/gl-account';
import {responseFormatter, CODE, STATUS} from '../config/response';

const getGlAccountsByBusinessTransactionId = async (
  req: Request,
  res: Response,
) => {
  try {
    const {businessTransactionId} = req.params;
    const glAccounts = await GlAccount.findAll({
      where: {businessTransactionId},
    });
    const response = responseFormatter(
      CODE[200],
      STATUS.SUCCESS,
      'Fetched',
      glAccounts,
    );
    res.status(CODE[200]).send(response);
  } catch (err: any) {
    const response = responseFormatter(CODE[500], STATUS.FAILURE, err, null);
    res.status(CODE[500]).send(response);
  }
};

export default {getGlAccountsByBusinessTransactionId};
