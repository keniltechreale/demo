import { Response } from 'express';
import * as Utils from '../../lib/utils';
import ReferFriendsService from '../../services/admin/referFriendSchema.service';
import { IRequest, ISearch } from '../../lib/common.interface';

export default new (class ReferFriendsController {
  UpdateReferFriends = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      ReferFriendsService.updateReferFriendSection(body, req.params.type)
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
  viewReferFriends = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        type: (req.query.type as string) || '',
      };
      ReferFriendsService.getReferFriendSection(args)
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
