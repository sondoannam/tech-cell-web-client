'use client';

import React, { useState, MouseEvent, FC } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { Percent, Visibility } from '@mui/icons-material';
import { Ascending, Descending } from '@components/svgs';

const ToggleButtonStyled = styled(ToggleButton)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    backgroundColor: '#f3f4f6 !important',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    color: '#444',
    fontSize: '12px',
    height: '34px',
    margin: '0 10px 10px 0',
    padding: '5px 10px',
    whiteSpace: 'nowrap',
    '&.Mui-selected': {
        backgroundColor: '#fef2f2 !important',
        border: `1px solid ${theme.color.red} !important`,
        color: theme.color.red + '!important',
    },
    '&.Mui-selected:hover': {
        backgroundColor: theme.primary.darker,
        color: 'white',
    },
    '&:hover': {
        backgroundColor: theme.color.lightGray,
    },
}));

interface ToolbarProps {
    className: string;
}

const SortingToolbar: FC<ToolbarProps> = ({ className }) => {
    const [sortByTag, setSortByTag] = useState('popular');

    const handleSortByTag = (event: MouseEvent<HTMLElement>, newSorting: string) => {
        setSortByTag(newSorting);
    };

    const sortByTagControl = {
        value: sortByTag,
        onChange: handleSortByTag,
        exclusive: true,
    };

    return (
        <Box sx={{ padding: '0 !important', margin: '20px 0px' }}>
            <Stack spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <Typography variant="h5" fontWeight={600} fontSize={18}>
                    Sắp xếp theo
                </Typography>
                <Box className={className}>
                    <ToggleButtonGroup
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'auto auto auto auto',
                            padding: '0px',
                            '& .MuiToggleButtonGroup-grouped': {
                                border: 0,
                                '&:not(:first-of-type)': {
                                    borderRadius: '10px',
                                },
                                '&:first-of-type': {
                                    borderRadius: '10px',
                                },
                            },
                        }}
                        {...sortByTagControl}
                    >
                        <ToggleButtonStyled value="ascending" key="ascending">
                            <Descending style={{ fontSize: '20px', marginRight: '5px' }} />
                            Giá Cao - Thấp
                        </ToggleButtonStyled>
                        <ToggleButtonStyled value="descending" key="descending">
                            <Ascending style={{ fontSize: '20px', marginRight: '5px' }} />
                            Giá Thấp - Cao
                        </ToggleButtonStyled>
                        <ToggleButtonStyled value="hot-promo" key="hot-promo">
                            <Percent sx={{ fontSize: '20px', marginRight: '5px' }} />
                            Khuyến mãi hot
                        </ToggleButtonStyled>
                        <ToggleButtonStyled value="popular" key="popular">
                            <Visibility sx={{ fontSize: '20px', marginRight: '5px' }} />
                            Xem nhiều
                        </ToggleButtonStyled>
                    </ToggleButtonGroup>
                </Box>
            </Stack>
        </Box>
    );
};

export default SortingToolbar;
