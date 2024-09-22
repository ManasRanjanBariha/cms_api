const { log } = require('console');
const { Applicant } = require('../models');
const formatResponse = require('../utils/formatResponse');
const path = require('path');

const apply = async (req, res) => {
    try {
        const { job_code, applicant_code, ...applicantData } = req.body;

        const file = req.file;
        console.log(applicant_code);
        
        if (file) {
            
            applicantData.resume_path = path.join('uploads', file.filename); 
        }
        

        const applicant = await Applicant.findOne({ where: { applicant_code } });

        if (!applicant) {
            return res.status(404).json(formatResponse(
                404,
                false,
                'Applicant not found.',
                null
            ));
        }

        if (applicant.job_code) {
            const newApplicant = await Applicant.create({
                ...applicant.get(),
                job_code: applicant.job_code,
                ...applicantData
            });
            return res.status(201).json(formatResponse(
                201,
                true,
                'New applicant created successfully.',
                newApplicant
            ));
        } else {
            const newApplicant = await Applicant.create({
                ...applicantData,
                job_code
            });
            return res.status(201).json(formatResponse(
                201,
                true,
                'Applicant data added successfully.',
                newApplicant
            ));
        }
    } catch (error) {
        return res.status(500).json(formatResponse(
            500,
            false,
            'Server error.',
            error.message
        ));
    }
};

module.exports = { apply };
