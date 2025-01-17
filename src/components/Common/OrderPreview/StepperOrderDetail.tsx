import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
const steps = [
    {
        time: '16:30',
        day: '26/1/2024',
        label: 'Đã giao hàng',
    },
    {
        time: '16:30',
        day: '26/1/2024',
        label: 'Đã giao hàng',
    },
    {
        time: '16:30',
        day: '22/1/2024',
        label: 'Đang chuẩn bị hàng',
    },
    {
        time: '16:30',
        day: '22/1/2024',
        label: 'Đang chuẩn bị hàng',
    },
    {
        time: '16:30',
        day: '22/1/2024',
        label: 'Đang chuẩn bị hàng',
    },
    {
        time: '16:30',
        day: '21/1/2024',
        label: 'Đang chuẩn bị hàng',
    },
];

const StepperOrderDetail = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} orientation='vertical'>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                            // optional={
                            //     firtOrder ? (
                            //         <Typography variant='caption'>Last step</Typography>
                            //     ) : null
                            // }
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '20%',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box>{step.time}</Box>
                                        <Box
                                            sx={{
                                                marginLeft: '5px',
                                            }}
                                        >
                                            {step.day}
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: '80%',
                                        }}
                                    >
                                        <Typography>{step.label}</Typography>
                                    </Box>
                                </Box>
                            </StepLabel>
                            {/* <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <div>
                                        <Button
                                            variant='contained'
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent> */}
                        </Step>
                    ))}
                </Stepper>
                {/* {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Reset
                        </Button>
                    </Paper>
                )} */}
            </Box>
        </>
    );
};

export default StepperOrderDetail;
