import Gifts from "@/models/Gifts.model";
import Bills from "@/models/Bills.model";
import BillSplits from "@/models/BillSplits.model";
import {
  getBill as billsInput,
  getGiftItem,
  getSplitBills,
} from "../types/getSplitBill.type";
import GroupMembers from "@/models/GroupMember.model";
export const getGift = async ({ groupId }: getGiftItem) => {
  try {
    const findBillId = await BillSplits.findOne({
      where: {
        group_id: groupId,
      },
      attributes: ["bill_id"],
    });
    const BillsId = findBillId?.getDataValue("bill_id") as number;
    const findGiftId = await Bills.findOne({
      where: {
        bill_id: BillsId,
      },
      attributes: ["gift_id"],
    });
    const GiftId = findGiftId?.getDataValue("gift_id") as number;
    const getGiftItem = await Gifts.findOne({
      where: {
        gift_id: GiftId,
      },
      attributes: ["name", "price"],
    });
    return getGiftItem;
  } catch (error) {
    console.error("Error Get Gift Item:", error);
    throw error;
  }
};
export const getBill = async ({ groupId }: billsInput) => {
  try {
    const findBillPayer = await GroupMembers.findOne({
        where:{
            group_id: groupId,
            role: "billPayer"
        },
        attributes: ["user_id"]
    });
    const userId = findBillPayer?.get("user_id") as number;
    const findBillId = await BillSplits.findOne({
      where: {
        group_id: groupId,
      },
      attributes: ["bill_id"],
    });
    const BillsId = findBillId?.getDataValue("bill_id") as number;
    const Getbill = await Bills.findOne({
      where: {
        bill_id: BillsId,
      },
      attributes: ["total_amount", "status"],
    });
    const result = {
        BillPayer: userId,
        Bill: Getbill
    }
    return result;
  } catch (error) {
    console.error("Error get bill:", error);
    throw error;
  }
};
export const getSplitBillbyuserId = async ({
  groupId,
  userId,
}: getSplitBills) => {
    try{
      const getAllSplitbills = await BillSplits.findAll({
       where:{
           group_id: groupId,
       }
      });
      const ownerAccount = getAllSplitbills.find((splitBill) => splitBill.get("user_id") === userId);
      const memberGroup = getAllSplitbills.filter((splitBill) => splitBill.get("user_id") !== userId);
  
      const result = {
        owner: ownerAccount,
        members: memberGroup,
      };
  
     return result;
  } catch (error) {
    console.error("Error get all splitBill:", error);
    throw error;
  }
};
