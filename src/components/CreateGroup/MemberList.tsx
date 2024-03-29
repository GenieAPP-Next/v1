import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import {
  avatarColors,
  getColorIndex,
} from "@/components/utils/avatarColorsUtils";
import { getInitials } from "../utils/initialUtils";
import { MemberListProps } from "./type";

export const MemberList: React.FC<MemberListProps> = ({
  members,
  selectedBillPayerId,
  onSelectBillPayer,
}) => {
  return (
    <Box>
      <Typography
        variant="caption"
        component="div"
        sx={{ textAlign: "right", marginBottom: 1 }}
      >
        Select Bill Payer
      </Typography>
      <List>
        {members.map((member) => {
          const colorIndex = getColorIndex(
            member.username,
            avatarColors.length
          );
          const isBillPayerSelected = selectedBillPayerId === member.user_id;
          return (
            <ListItem
              sx={{ borderBottom: "1px solid grey" }}
              key={member.user_id}
              secondaryAction={
                <Radio
                  checked={isBillPayerSelected}
                  onChange={() => {
                    onSelectBillPayer(member.user_id);
                  }}
                  value={member.user_id}
                  name="radio-buttons"
                  inputProps={{ "aria-label": member.user_id }}
                  sx={{
                    color: isBillPayerSelected ? "purple" : "default",
                    "&.Mui-checked": {
                      color: "purple",
                    },
                  }}
                />
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: avatarColors[colorIndex] }}>
                  {getInitials(member.username)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.username} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
