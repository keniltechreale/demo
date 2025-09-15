import { Response } from 'express';
import * as Utils from '../../lib/utils';
import MiscService from '../../services/users/misc.service';
import { IRequest, ISearch } from '../../lib/common.interface';
import { GooglePlaceArgs } from 'src/lib/google.utils';

export default new (class LegalContentController {
  viewLegalContent = (req: IRequest, res: Response): void => {
    try {
      //controller logic
      MiscService.getLegalContent(req.params.type)
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

  viewFAQs = (req: IRequest, res: Response): void => {
    try {
      MiscService.getFAQs()
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
  viewAllCareers = (req: IRequest, res: Response): void => {
    try {
      MiscService.getCareers()
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
  viewTestimonial = (req: IRequest, res: Response): void => {
    try {
      MiscService.getAllTestimonials()
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

  viewBlogs = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 30,
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };
      MiscService.getAllBlogs(args)
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
  viewBlogById = (req: IRequest, res: Response): void => {
    try {
      MiscService.getBlogById(req.params.blog_id)
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
      MiscService.getReferFriendsDetails(req.params.type)
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

  viewVehicleTypes = (req: IRequest, res: Response): void => {
    try {
      MiscService.getAllVehicleType()
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
  viewCountryData = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        code: req.query.code as string,
        name: req.query.name as string,
      };
      MiscService.getCountryData(args)
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
  addContactUsData = (req: IRequest, res: Response) => {
    const body = req.body as Record<string, unknown>;

    MiscService.contactUs(body)
      .then((result) => res.status(Utils.statusCode.OK).send(result))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  applyForCareer = (req: IRequest, res: Response) => {
    const body = req.body as Record<string, unknown>;

    MiscService.applyForCareer(body)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  checkReferalCode = (req: IRequest, res: Response) => {
    const args: ISearch = {
      referral_code: req.query.referral_code as string,
    };
    MiscService.checkReferalCode(args, req.params.role)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  ViewCountryStateCity = (req: IRequest, res: Response): void => {
    try {
      MiscService.getCountryStateCity()
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

  ViewVehilceCategories = (req: IRequest, res: Response): void => {
    try {
      MiscService.getAllVehilceCategories()
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

  viewAllNotifications = (req: IRequest, res: Response): void => {
    try {
      const args: ISearch = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 150,
        search: (req.query.search as string) || '',
        isRead: (req.query.isRead as string) || '',
        type: (req.query.type as string) || '',
      };
      MiscService.getNotifications(args, req.user.id)
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

  updateNotifications = (req: IRequest, res: Response): void => {
    try {
      MiscService.updateNotification(req.user.id)
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

  deleteAllNotifications = (req: IRequest, res: Response): void => {
    try {
      MiscService.deleteAllNotification(req.user.id)
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

  ViewAllFeedbacks = (req: IRequest, res: Response): void => {
    try {
      MiscService.getAllFeedbacks(req.params.role)
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

  ViewFooter = (req: IRequest, res: Response): void => {
    try {
      MiscService.getFooter()
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

  ViewCoupons = (req: IRequest, res: Response): void => {
    try {
      MiscService.getCoupons()
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
  viewGooglePopular = (req: IRequest, res: Response): void => {
    try {
      const args: GooglePlaceArgs = {
        location: req.query.location as string,
        radius: Number(req.query.radius) || 0,
        type: req.query.type as string,
      };
      MiscService.getPopularPalces(args)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(result);
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
