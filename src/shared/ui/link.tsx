import * as React from 'react';
import { createLink } from '@tanstack/react-router';
import type { LinkComponent } from '@tanstack/react-router';
import { NavLink } from '@mantine/core';
import type { NavLinkProps } from '@mantine/core';

interface MantineLinkProps extends Omit<NavLinkProps, 'href' | 'component'> {}

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MantineLinkProps
>((props, ref) => {
  return <NavLink component="a" ref={ref} {...props} />;
});

MantineLinkComponent.displayName = 'MantineLinkComponent';

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const Link: LinkComponent<typeof MantineLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
