const jsonData = require('../../scrappedData.json');

const handleAdvices = async (req, res, next) => {
  try {
    if (jsonData) {
      return res.status(200).json(jsonData.filter(elem => elem !== null));
    }
  } catch (error) {
    return res.status(404).json({message: 'Došlo je do pogrješke!'})
  }
};

exports.handleAdvices = handleAdvices;
