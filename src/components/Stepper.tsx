import classnames from 'classnames';

import './Stepper.scss';

interface Props {
  className?: string;
  current: number;
  total: number;
}

export default function Stepper({ current, total, className, ...rest }: Props) {
  const currentOffset = current - 1;
  const stepperClassName = classnames('Stepper', className);

  return (
    <div className={stepperClassName} {...rest}>
      {Array.from({ length: total }, (_, index) =>
        index === currentOffset ? (
          <div key={index} className="Stepper-wrapper">
            <div className="Stepper-wrapper-activeStep" />
          </div>
        ) : (
          <div key={index} className="Stepper-step" />
        )
      )}
    </div>
  );
}
