"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from '@styles/components/cart.module.scss';

import { AddCartItemModel, CartItemModel } from '@models/Cart';
import { currencyFormat } from 'utils';

import { useSkipFirstRender } from '@hooks/useSkipFirstRender';
import { useAppDispatch } from '@store/store';
import { addItemToCart } from '@store/slices/cartSlice';

import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { ProductLabel } from '@interfaces/product';
import { VariationModel } from '@models/Product';

type productDataProps = {
    label: ProductLabel;
    currentVariant: VariationModel;
    itemData: CartItemModel;
    refreshCart: () => void;
    isChecked: boolean;
    handleCheckBox: (id: string) => void;
};

export const ItemCard = (props: productDataProps) => {
    const { label, currentVariant, itemData, refreshCart, isChecked, handleCheckBox } = props;

    const dispatch = useAppDispatch();

    const [updateInfo, setUpdateInfo] = useState<AddCartItemModel | null>(null);

    const [totalAmount, setTotalAmount] = useState<number>(0);

    useSkipFirstRender(() => {
        if (updateInfo) {
            const timer1 = setTimeout(() => {
                dispatch(addItemToCart(updateInfo));
    
                const timer2 = setTimeout(() => {
                    refreshCart();
                }, 300);
    
                return () => clearTimeout(timer2);
            }, 600);
    
            return () => clearTimeout(timer1);
        }
    }, [updateInfo]);

    const handleUpdateQuantity = (quantityUpdate: number) => {
        const currentQuantity = updateInfo !== null ? updateInfo.quantity : itemData.quantity;
        let newQuantity = currentQuantity + quantityUpdate;

        if (newQuantity <= 0) {
            newQuantity = 1;
        }
        if (newQuantity > currentVariant.stock) {
            toast.info('Số lượng sản phẩm không đủ để đáp ứng!');
            newQuantity = currentVariant.stock;
        }
        setUpdateInfo({
            ...itemData,
            quantity: newQuantity,
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleCheckBox(`${itemData.productId}/${itemData.sku}`);
    }

    //console.log(updateInfo);

    return (
        <div className={styles.cart_content}>
            <div className={styles.product_cart}>
                <div className={styles.product_cart_check}>
                    <Checkbox
                        checked={isChecked}
                        onChange={handleChange}
                        sx={{
                            color: 'rgba(238, 73, 73, 0.8)',
                            '&.Mui-checked': {
                                color: 'rgba(238, 73, 73)',
                            },
                        }}
                    />
                </div>
                <Image
                    src={currentVariant.images[0].url}
                    height={80}
                    width={80}
                    alt="product image"
                />
                <div className={styles.product_info}>
                    <div className={styles.product_text}>
                        <div className={styles.product_heading}>{label.name}</div>
                        <div className={styles.product_price}>
                            <div className={styles.product_price_new}>
                                {currencyFormat(currentVariant.price.sale * itemData.quantity)}
                            </div>
                            <div className={styles.product_price_old}>
                                <span>
                                    {currencyFormat(currentVariant.price.base * itemData.quantity)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.product_quanity}>
                        <button
                            type="button"
                            className={styles.product_quanity_btn}
                            onClick={() => handleUpdateQuantity(-1)}
                        >
                            -
                        </button>
                        <div className={styles.product_quanity_number}>{updateInfo ? updateInfo.quantity : itemData.quantity}</div>
                        <button
                            type="button"
                            className={styles.product_quanity_btn}
                            onClick={() => handleUpdateQuantity(1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className={styles.product_cart_delete}>
                    <DeleteIcon />
                </div>
            </div>
        </div>
    );
};