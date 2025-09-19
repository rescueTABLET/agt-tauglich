import { IconButton, IconButtonProps } from "@mui/material";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { forwardRef } from "react";

type LinkProps = Omit<IconButtonProps, "href">;

const RouterIconButtonLink = forwardRef<HTMLButtonElement, LinkProps>(
  (props, ref) => {
    return <IconButton ref={ref} {...props} />;
  }
);

RouterIconButtonLink.displayName = "RouterIconButtonLink";

const RouterIconButton: LinkComponent<typeof RouterIconButtonLink> =
  createLink(RouterIconButtonLink);

export default RouterIconButton;
