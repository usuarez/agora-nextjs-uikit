import { FC, ReactNode } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const TooltipWrapper: FC<{
  children: ReactNode | any;
  text: string;
}> = ({ children, text }) => {
  const renderTooltip = (text: string, props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => renderTooltip(text, props)}
    >
      {children}
    </OverlayTrigger>
  );
};
