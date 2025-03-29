import { useQuery } from "@tanstack/react-query";

interface UseTransactionsProps {
  user_id: string;
}

export const useTransactions = ({
  user_id,
}: UseTransactionsProps) => {

  const { isPending, data, isError, refetch } = useQuery({
    queryKey: ['transactions', user_id],
    queryFn: async () => walletServices.getUserWallets(user_id),
    enabled: !!user_id
  });

}