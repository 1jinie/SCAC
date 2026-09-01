import { render, screen } from '@testing-library/react';
import AdminSummary from './components/common/Summary';

test('관리 현황 요약 카드를 표시한다', () => {
  const items = [
    {
      key: 'total',
      label: '전체 장치',
      value: 4,
      unit: '대',
      description: '등록된 모든 장치',
      color: 'blue',
    },
    {
      key: 'error',
      label: '오류',
      value: 1,
      unit: '대',
      description: '즉시 확인 필요',
      color: 'red',
      alert: true,
    },
  ];

  render(<AdminSummary items={items} />);

  expect(
    screen.getByRole('region', { name: '관리 현황 요약' }),
  ).toBeInTheDocument();

  expect(screen.getByText('전체 장치')).toBeInTheDocument();
  expect(screen.getByText('등록된 모든 장치')).toBeInTheDocument();
  expect(screen.getByText('오류')).toBeInTheDocument();
  expect(screen.getByText('즉시 확인 필요')).toBeInTheDocument();

  const summaryCards = screen.getAllByRole('article');
  const errorCard = summaryCards[1];

  expect(errorCard).toHaveClass('is_alert');
});
