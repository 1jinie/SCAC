import { fireEvent, render, screen } from '@testing-library/react';
import KioskErrorState from './components/common/KioskErrorState';

test('오류 정보와 다시 시도 버튼을 표시한다', () => {
  const handleRetry = jest.fn();

  render(
    <KioskErrorState
      status={500}
      title="정보를 불러오지 못했습니다."
      message="잠시 후 다시 시도해 주세요."
      onRetry={handleRetry}
    />,
  );

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText('[500 Error!]')).toBeInTheDocument();
  expect(screen.getByText('정보를 불러오지 못했습니다.')).toBeInTheDocument();
  expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));

  expect(handleRetry).toHaveBeenCalledTimes(1);
});
