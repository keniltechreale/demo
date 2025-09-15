import { Response } from 'express';
import * as Utils from '../../lib/utils';
import FAQsService from '../../services/admin/faqs.service';
import { IRequest, ISearch } from '../../lib/common.interface';
import paginationConfig from '../../config/pagination.config';

export default new (class FAQsController {
  addFAQs = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      FAQsService.addFAQs(body)
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

  viewAllFAQs = (req: IRequest, res: Response) => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };
      FAQsService.getAllFAQs(args)
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

  updateFAQs = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      FAQsService.updateFAQs(body, req.params.faqs_id)
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

  deleteFAQs = (req: IRequest, res: Response): void => {
    try {
      const args = {
        faqsId: req.params.faqs_id,
      };
      FAQsService.deleteFAQs(args)
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
