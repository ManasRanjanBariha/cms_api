const { log } = require('console');
const { Applicant } = require('../models');
const formatResponse = require('../utils/formatResponse');
const path = require('path');

const apply = async (req, res) => {
    try {
        const { job_code,qualification, ...applicantData } = req.body;

       const applicant_code = req.user.applicant_code;
        
        const file = req.file;
        if (file) {
            applicantData.resume_path = path.join('uploads', file.filename); 
        }

        if (Array.isArray(qualification)) {
            applicantData.qualification = JSON.stringify(qualification);
        }

        const applicant = await Applicant.findOne({ where: { applicant_code } });

        let newApplicantData;
        let newApplicant;
        
        const {id,...applicantOldData} =applicant.get(); 

        if (!applicant) {
            return res.status(404).json(formatResponse(
                404,
                false,
                'Applicant not found.',
                null
            ));
        }

        if (applicant.job_code) {
            
            newApplicantData = {
                ...applicantOldData,
                ...applicantData, 
                job_code: applicant.job_code 
            };
             newApplicant = await Applicant.create(newApplicantData);
           
        } else {
            
            newApplicantData = {
                ...applicantOldData,
                ...applicantData,
                job_code
            };
            
            await Applicant.update(newApplicantData, {
                where: { applicant_code }
            });

            
            newApplicant = await Applicant.findOne({ where: { applicant_code } });
            
        }
        if(newApplicant)
        {
            return res.status(201).json(formatResponse(
                201,
                true,
                'Successfully applied for the job.',
                newApplicant
            ));
        }
        else{
            return res.status(201).json(formatResponse(
                401,
                false,
                'Error.',
                newApplicant
            ));
        }
        

        
    } catch (error) {
        log(error)
        return res.status(500).json(formatResponse(
            500,
            false,
            'Server error.',
            error
        ));
    }
};

const view = async (req,res)=>
{

    const {applicantCode,jobCode}=req.params;
    console.log(applicantCode,jobCode);

    const applicantData = await Applicant.findOne({ where: { applicant_code:applicantCode,job_code:jobCode } });

    if(applicantData)
    {
        return res.status(200).json(formatResponse(200,true,"Applicant Data Retrived Successfully",applicantData))
    }
    else{
        return res.status(401).json(formatResponse(401,false,"Applicant Data not found"))

    }
    
}

module.exports = { apply,view };
