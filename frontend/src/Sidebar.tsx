import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@material-ui/icons";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MenuIcon onClick={handleDrawerOpen} />
      <Drawer variant="persistent" open={open}>
        <div>
          <ChevronLeftIcon onClick={handleDrawerClose} />
        </div>
        <List>
          {/* Add your list items here */}
          <ListItem button>
            <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
            <ListItemText primary={"Item"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
