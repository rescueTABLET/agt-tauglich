import { createLink, LinkComponent } from '@tanstack/react-router';
import { forwardRef } from 'react';
import { Button, ButtonProps } from '@mui/material';

type LinkProps = Omit<ButtonProps, 'href'>;

const RouterButtonLink = forwardRef<HTMLButtonElement, LinkProps>((props, ref) => {
  return <Button ref={ref} {...props} />;
});

RouterButtonLink.displayName = 'RouterButtonLink';

const RouterButton: LinkComponent<typeof RouterButtonLink> = createLink(RouterButtonLink);

export default RouterButton;
