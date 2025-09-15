import { Response } from 'express';
import * as Utils from '../../lib/utils';
import FeedBacksService from '../../services/admin/feedback.service';
import { IRequest, ISearch } from '../../lib/common.interface';
import paginationConfig from '../../config/pagination.config';

export default new (class FAQsController {
  AddFeedbacks = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      FeedBacksService.addFeedbacks(body)
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

  ViewAllFeedbacks = (req: IRequest, res: Response) => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };
      FeedBacksService.getAllFeedbacks(args)
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

  UpdateFeedbacks = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      FeedBacksService.updateFeedbacks(body, req.params.feedback_id)
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

  DeleteFeedbacks = (req: IRequest, res: Response): void => {
    try {
      const args = {
        feedbackId: req.params.feedback_id,
      };
      FeedBacksService.deleteFeedbacks(args)
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
