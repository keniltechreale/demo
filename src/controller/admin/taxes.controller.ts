import { Response } from 'express';
import * as Utils from '../../lib/utils';
import TaxesService from '../../services/admin/taxes.service';
import { IRequest } from '../../lib/common.interface';

export default new (class TaxesController {
  viewTaxes = (req: IRequest, res: Response): void => {
    try {
      TaxesService.getTaxes()
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  updateTaxes = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      TaxesService.updateTaxes(body)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
