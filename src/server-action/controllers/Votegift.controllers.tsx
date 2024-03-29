import { voteGift } from "../services/Votegift.service";
import { CountVote } from "../services/Countvote.service";
import { NextRequest, NextResponse } from "next/server";
import GroupMembers from "@/models/GroupMember.model";

export const votingGift = async (req: NextRequest, res: NextResponse) => {
  if (req.method === "POST") {
    const body = await req.json();
    try {
      const { groupId, giftId, userId } = body;

      const countingVote = await CountVote({ giftId });
      const memberGroup = await GroupMembers.count({
        where: {
          group_id: groupId,
        },
      });
      if (countingVote < memberGroup) {
        const newVote = await voteGift(
          {
            giftId,
            userId,
          },
          {
            groupId,
          }
        );
        console.log(newVote);
        return NextResponse.json(
          {
            success: true,
            message: "Success vote gift",
            data: newVote,
          },
          { status: 200 }
        );
      }
      if (countingVote === memberGroup) {
        return NextResponse.json(
          {
            success: true,
            message: "All group member have voted",
          },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error("Error vote gift:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      {
        success: false,
        message: `Method ${req.method} is invalid`,
      },
      { status: 500 }
    );
  }
};
