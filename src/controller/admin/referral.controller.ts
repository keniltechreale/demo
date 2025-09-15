import { Response } from 'express';
import * as Utils from '../../lib/utils';
import ReferralService from '../../services/admin/referral.service';
import { IRequest, ISearch } from '../../lib/common.interface';
import paginationConfig from '../../config/pagination.config';

export default new (class ReferralController {
  // Get all referrals
  viewAllReferrals = (req: IRequest, res: Response) => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || paginationConfig.PER_PAGE,
        search: (req.query.search as string) || '',
        status: req.query.status as string,
      };
      ReferralService.getAllReferrals(args)
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

  // Update a referral
  updateReferral = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      const referralId = req.params.referral_id;
      ReferralService.updateReferral(body, referralId)
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

  // Delete a referral
  deleteReferral = (req: IRequest, res: Response): void => {
    try {
      const referralId = req.params.referral_id;
      ReferralService.deleteReferral({ referralId })
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
