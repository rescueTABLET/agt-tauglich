import { createLink, LinkComponent } from '@tanstack/react-router';
import { ListItemButton, type ListItemButtonProps } from '@mui/material';
import { forwardRef } from 'react';

type LinkProps = Omit<ListItemButtonProps, 'href'>;

const RouterListItemButtonLink = forwardRef<HTMLDivElement, LinkProps>((props, ref) => {
  return <ListItemButton ref={ref} {...props} />;
});

RouterListItemButtonLink.displayName = 'RouterListItemButtonLink';

const RouterListItemButton: LinkComponent<typeof RouterListItemButtonLink> = createLink(RouterListItemButtonLink);

export default RouterListItemButton;
