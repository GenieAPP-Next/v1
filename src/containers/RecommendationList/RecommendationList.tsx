/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React, { useEffect, useState } from "react";
import SwiperComponent from "@/components/SwiperComponent/SwiperComponent";
import RecommendationCard from "@/components/Card/RecommendationCard/RecommendationCard";
import { Box, Button, Divider, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import ListCard from "@/components/Card/ListCard/ListCard";
import SubmitButton from "@/components/Button/SubmitButton/SubmitButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AddGiftCard from "@/components/AddGift/AddGiftCard";
import { AddGift } from "@/components/AddGift/type";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
import { useParams } from "next/navigation";
import axios from "axios";

interface RecommendationListProps {
  data: Array<{
    urlLink: string;
    id: string;
    itemName: string;
    price: number;
    itemImage: string;
    creator: string;
  }>;
}

interface Item {
  id: string;
  itemName: string;
  price: number;
  itemImage: string;
  creator?: string;
  isRecommendation?: boolean;
  urlLink?: string;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ data }) => {
  const theme = useTheme();
  const params = useParams<{ groupName: string }>();
  const [giftItems, setGiftItems] = useState<Item[]>([]);
  const [giftItemsLocal, setGiftItemsLocal] = useState<Item[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/recommendation/${params.groupName}`);
        const data = response.data.data;
        console.log(data);

        const giftData: Item[] = data.map((item: any) => ({
          id: item.gift_id.toString(),
          itemName: item.name,
          price: parseFloat(item.price),
          itemImage: item.image_url,
          creator: item.user.username,
          isRecommendation: true,
          urlLink: "" /*nanti ubah ini, ubah endpointnya dulu*/,
        }));

        setGiftItems(giftData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const storedItems: Item[] = JSON.parse(localStorage.getItem("giftItems") ?? "[]");
    setGiftItemsLocal(storedItems);
  }, []);
  console.log(giftItems);
  console.log(giftItemsLocal);

  const handleAdd = (id: string) => {
    const existingGiftItems: Item[] = JSON.parse(localStorage.getItem("giftItems") ?? "[]");

    const selectedItem = data.find((item) => item.id === id);
    if (selectedItem && !existingGiftItems.some((item: Item) => item.id === id)) {
      const updatedGifts: Item[] = [
        ...existingGiftItems,
        {
          ...selectedItem,
          isRecommendation: true,
          urlLink: selectedItem.urlLink,
        }, // Menandai sebagai rekomendasi
      ];

      localStorage.setItem("giftItems", JSON.stringify(updatedGifts));
      setGiftItemsLocal(updatedGifts);
      console.log("Added recommendation gift:", selectedItem);
    }
  };

  const handleAddNewGift = (gift: AddGift) => {
    // Pastikan image telah diupload dan URL tersedia
    if (!gift.itemImage) {
      console.error("No image URL available for the gift");
      return; // Atau tampilkan pesan error kepada pengguna
    }

    const priceAsString = "123.45"; // This might come from an input field
    const priceAsNumber = parseFloat(priceAsString);

    const newGift: Item = {
      id: new Date().getTime().toString(), // ID unik untuk gift baru
      itemName: gift.itemName, // Nama gift
      price: priceAsNumber, // Harga gift
      itemImage: gift.itemImage, // URL gambar gift dari ImgBB
      creator: localStorage.getItem("user_id") ?? "Unknown", // User ID dari localStorage
      urlLink: gift.src, // Link marketplace
      isRecommendation: false, // Tandai sebagai bukan rekomendasi
    };

    console.log("Added new gift:", newGift);

    const updatedGifts = [...giftItems, newGift];
    setGiftItemsLocal(updatedGifts);
    localStorage.setItem("giftItems", JSON.stringify(updatedGifts));
    setDrawerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const payload = giftItems.map((item) => ({
        groupId: 33, // ID grup hardcoded
        name: item.itemName,
        price: item.price,
        imageUrl: item.itemImage,
        urlLink: item.urlLink,
        userId: localStorage.getItem("user_id") ?? "Unknown", // User ID dari localStorage
        categoryId: 1, // ID kategori hardcoded
        isRecommendation: item.isRecommendation, // Menambahkan flag isRecommendation
        recommendedGroupId: item.isRecommendation ? 31 : undefined,
      }));

      console.log("Payload before submission:", payload);

      const response = await fetch("/api/addGift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ giftItems: payload }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit gifts");
      }

      const responseData = await response.json();
      console.log("Submit response:", responseData);
    } catch (error) {
      console.error("Error during gift submission:", error);
    }
  };

  return (
    <>
      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: 16,
          fontWeight: 500,
          padding: "20px 0 10px 20px",
        }}
      >
        Recommendation
      </Typography>
      <SwiperComponent>
        {giftItems.map((item) => (
          <div key={item.id}>
            <RecommendationCard
              id={item.id}
              itemName={item.itemName}
              price={item.price}
              itemImage={item.itemImage}
              onClick={() => {
                handleAdd(item.id);
              }}
            />
          </div>
        ))}
      </SwiperComponent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px 14px 16px",
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Your Gift
        </Typography>
        <Button
          variant='text'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => {
            setDrawerOpen(true);
          }}
          sx={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Typography>Add Gift</Typography>
        </Button>
      </Box>
      <Divider
        sx={{
          width: "calc(425px - 24px)",
          marginX: "auto",
          color: "#CAC4D0",
          marginBottom: "15px",
        }}
      />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "400px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: "15px",
          }}
        >
          {giftItemsLocal.map((item) => (
            <Box key={item.id}>
              <ListCard
                id={item.id}
                itemName={item.itemName}
                price={item.price}
                itemImage={item.itemImage}
                creator={item.creator}
                urlLink={item.urlLink}
              />
            </Box>
          ))}
        </Box>
        <SubmitButton onClick={handleSubmit} disabled={!giftItems.length}>
          Submit
        </SubmitButton>
      </Box>
      <SwipeableDrawer
        anchor='bottom'
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        onOpen={() => {
          setDrawerOpen(true);
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: "425px",
            borderRadius: "25px 25px 0 0",
            margin: "auto",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <HorizontalRuleRoundedIcon sx={{ fontSize: "large" }} />
        </Box>
        <AddGiftCard onAddGift={handleAddNewGift} />
      </SwipeableDrawer>
    </>
  );
};

export default RecommendationList;
