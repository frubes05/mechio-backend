const { Tracking } = require("../../models/tracking/tracking");

const newTracking = async (req, res, next) => {
  const { action, category, companyId, isEmployed, isRegistered, userId, userLocation, jobId, jobPosition, date } =
    req.body;

  try {
    const tracking = await Tracking({
      action,
      category,
      companyId,
      isEmployed,
      isRegistered,
      userId,
      userLocation,
      jobId,
      jobPosition,
      date,
    }).save();
    return res.status(200);
  } catch (error) {
    return res.status(404);
  }
};

const getSpecificTrackingData = async(req, res, next) => {
    const {action, category, companyId} = req.params;
    
    try {
        const trackingData = await Tracking.find({action, category, companyId});
        return res.status(200).json({trackingData});
    } catch (error) {
        return res.status(404).json({message: 'Došlo je do pogrješke!'});
    }
}

const getTrackingData = async(req, res, next) => {  
  const { id } = req.params;

  try {
      const trackingData = await Tracking.find({companyId: id});
      return res.status(200).json(trackingData);
  } catch (error) {
      return res.status(404).json({message: 'Došlo je do pogrješke!'});
  }
}

exports.newTracking = newTracking;
exports.getSpecificTrackingData = getSpecificTrackingData;
exports.getTrackingData = getTrackingData;