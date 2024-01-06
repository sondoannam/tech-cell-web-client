'use client';

import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { Paging } from '@models/Common';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CartItemCard from './CartItemCard';
import CartPromotions from './CartPromotions';
import CartSaleBanners from './CartSaleBanners';
import { scrollToTop, addOrRemoveFromArray } from 'utils';
import CartFooterInformation from './CartFooter';
import { LoadingSection } from '../Display';
import PaginationBar from '../PaginationData/PaginationBar';
import { CART_PAGING } from '@constants/CartPaging';
import IconButton from '@mui/material/IconButton';
import { useCart } from '@hooks/userCart';

type CartItemPrice = {
    itemId: string;
    sku: string;
    price: number;
};

function CartPage() {
    const { carts, status } = useCart();

    const [pagingData, setPagingData] = useState<Paging>(CART_PAGING);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [showUncheckMsg, setShowUncheckMsg] = useState<boolean>(false);
    const [totalAmount, setTotalAmount] = useState<CartItemPrice[]>([]);
    const [checkedTotal, setCheckedTotal] = useState<number>(0);

    useEffect(() => {
        console.log(checkedList);
        if (checkedList.length > 0) {
            let total = 0;
            const itemsChecked = checkedList.map((listItem) => {
                const data = listItem.split('-/-');
                return {
                    id: data[0],
                    sku: data[1],
                };
            });
            console.log(itemsChecked);
            totalAmount.forEach((item) => {
                for (const element of itemsChecked) {
                    if (element.id === item.itemId && element.sku === item.sku) {
                        total += item.price;
                        break;
                    }
                }
            });
            setCheckedTotal(total);
        }
    }, [checkedList, totalAmount]);

    const handleCalculateTotal = (id: string, sku: string, price: number) => {
        const currentAmount = totalAmount;
        const itemAmount = currentAmount.findIndex(
            (item) => item.itemId === id && item.sku === sku,
        );
        if (itemAmount !== -1) {
            currentAmount.splice(itemAmount, 1);
        }
        currentAmount.push({
            itemId: id,
            sku,
            price,
        });
        setTotalAmount(currentAmount);
    };

    const handleCheckAll = () => {
        let arr: string[] = [];
        if (checkedList.length !== carts?.products?.length) {
            arr = carts?.products?.map(
                (product) => `${product.productId}-/-${product.sku}-/-${product.quantity}`,
            ) as string[];
        }
        setCheckedList(arr);
        handleShowMsg(true);
    };

    const handleCheckProduct = (id: string) => {
        let list = [...checkedList];
        list = addOrRemoveFromArray(list, id);
        setCheckedList(list);
        handleShowMsg(true);
    };

    const handleShowMsg = (isSelected: boolean) => {
        if (!isSelected) {
            setShowUncheckMsg(true);
            scrollToTop();
        } else setShowUncheckMsg(false);
    };

    const handleChangePage = (event: ChangeEvent<unknown>, page: number) => {
        setPagingData({
            ...pagingData,
            page: page - 1,
        });
    };

    const saveProductQuery = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        localStorage.setItem('select-item-query', checkedList.toString());
    };

    return (
        <Box
            sx={{
                backgroundColor: '#f4f6f8',
                minHeight: '60vh',
            }}
        >
            {carts ? (
                <>
                    <Container
                        maxWidth={false}
                        sx={{
                            maxWidth: '700px',
                            borderRadius: '5px',
                            padding: '10px',
                            margin: 'auto',
                        }}
                    >
                        <Stack spacing={3} alignItems='center' minHeight='60vh'>
                            <Box
                                sx={{
                                    width: '100%',
                                    padding: '10px',
                                    borderBottom: '1px solid #e5e5e5',
                                    color: '#323232',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <IconButton aria-label='home' href='/'>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant='h4' sx={{ fontSize: '22px' }}>
                                    Giỏ hàng của bạn
                                </Typography>
                            </Box>

                            {carts.cartCountProducts <= 0 ? (
                                <Typography
                                    variant='h4'
                                    sx={{ fontSize: '18px', textAlign: 'center' }}
                                >
                                    Bạn chưa thêm sản phẩm nào vào giỏ hàng
                                </Typography>
                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: showUncheckMsg ? 'flex' : 'none',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant='h3'
                                            color='primary'
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Bạn cần chọn sản phẩm trước khi tiến hành thanh toán
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <FormControlLabel
                                            label='Chọn tất cả'
                                            control={
                                                <Checkbox
                                                    //defaultChecked
                                                    checked={
                                                        checkedList.length ===
                                                        carts?.products?.length
                                                    }
                                                    onChange={handleCheckAll}
                                                    sx={{
                                                        color: 'rgba(238, 73, 73, 0.8)',
                                                        '&.Mui-checked': {
                                                            color: 'rgba(238, 73, 73, 0.6)',
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            margin: '25px auto',
                                            backgroundColor: 'white',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            width: '100%',
                                        }}
                                    >
                                        {carts?.products?.map((item, i) => (
                                            <CartItemCard
                                                key={`${item.productId}_${
                                                    item.sku
                                                }_${i.toString()}`}
                                                itemData={item}
                                                isSelected={checkedList.includes(
                                                    `${item.productId}-/-${item.sku}-/-${item.quantity}`,
                                                )}
                                                handleCheckBox={handleCheckProduct}
                                                passThisItemPrice={handleCalculateTotal}
                                            />
                                        ))}
                                        {carts && (
                                            <Box>
                                                <PaginationBar
                                                    pagingData={{
                                                        page: pagingData.page,
                                                        totalPage: Math.ceil(
                                                            carts.cartCountProducts /
                                                                CART_PAGING.pageSize,
                                                        ),
                                                    }}
                                                    handleChange={handleChangePage}
                                                />
                                            </Box>
                                        )}
                                        <CartPromotions />
                                        <CartSaleBanners />
                                    </Box>
                                </>
                            )}
                        </Stack>
                    </Container>
                    {carts.cartCountProducts !== 0 && (
                        <Box sx={{ padding: '10px' }}>
                            <CartFooterInformation
                                isSelectedProduct={checkedList.length !== 0}
                                handleShowMsg={() => {
                                    handleShowMsg(checkedList.length !== 0);
                                }}
                                saveSelectedProducts={saveProductQuery}
                                totalPrice={checkedTotal}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <LoadingSection isLoading={true} />
            )}
        </Box>
    );
}

export default CartPage;
