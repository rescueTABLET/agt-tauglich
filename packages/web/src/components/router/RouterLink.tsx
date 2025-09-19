import { createLink, LinkComponent } from '@tanstack/react-router';
import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';
import { forwardRef } from 'react';

type MUILinkProps = Omit<MuiLinkProps, 'href'>;

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkProps>((props, ref) => {
  return <MuiLink ref={ref} {...props} />;
});

MUILinkComponent.displayName = 'MUILinkComponent';

const RouterLink: LinkComponent<typeof MUILinkComponent> = createLink(MUILinkComponent);

export default RouterLink;
