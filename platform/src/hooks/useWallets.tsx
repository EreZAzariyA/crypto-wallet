import { App } from "antd";
import { CoinsType } from "../utils/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import walletServices from "../services/wallets";
import { WalletModel } from "../models";
import { queryClient } from "../main";

interface UseWalletsProps {
  user_id: string;
}

export const useWallets = ({ user_id }: Partial<UseWalletsProps>) => {
  const { notification } = App.useApp();

  const { isPending, data, isError, refetch } = useQuery({
    queryKey: ['wallets', user_id],
    queryFn: async () => walletServices.getUserWallets(user_id),
    enabled: !!user_id
  });

  const mutation = useMutation<WalletModel, Error, { user_id: string, coin: CoinsType }>({
    mutationFn: ({ user_id, coin }) => {
      return walletServices.createWallet(user_id, coin)
    },
    onSuccess: (wallet) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', user_id] });
      notification.success({ message: `Wallet ${wallet.name} created successfully` });
    }
  });

  const wallets: Record<string, WalletModel> = {};
  if (data) {
    data.forEach((wallet) => {
      wallets[wallet.name] = wallet
    });
  }

  const createWallet = async (coin: CoinsType) => {
    try {
      return await mutation.mutateAsync({ user_id, coin });
    } catch (error: any) {
      notification.error({
        message: `Error while trying to create ${coin} address`,
        description: error
      });
    }
  };

  return {
    wallets,
    walletsLoading: isPending,
    error: isError,
    createWallet,
    refetch,
  };
}