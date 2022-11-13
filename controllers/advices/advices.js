const cvData = require('../../scrapping/data/getCV.json');
const employeeData = require('../../scrapping/data/getEmployee.json');

const handleAdvices = async (req, res, next) => {
  const {state} = req.params;
  try {
    if (state === 'posloprimac') {
      return res.status(200).json(cvData.filter(elem => elem !== null));
    } else if (state === 'poslodavac') {
      return res.status(200).json(employeeData.filter(elem => elem !== null));
    }
  } catch (error) {
    return res.status(404).json({message: 'Došlo je do pogrješke!'})
  }
};

exports.handleAdvices = handleAdvices;
