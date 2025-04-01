import { App, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import walletServices from "../services/wallets";
import { WalletModel } from "../models";
import { queryClient } from "../main";
import { CoinsType } from "../utils/coinsUtils";
import { Event, useSocketEvents } from "./useSocketEvents";

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
    },
  });

  const wallets: Record<string, WalletModel & { rate: number }> = {};
  if (data) {
    data.forEach((wallet) => {
      wallets[wallet.name] = {
        ...wallet,
        rate: 0
      }
    });
  }

  const events: Event[] = [
    {
      name: 'admin:wallet:create',
      handler: (wallet: WalletModel) => {
        refetch();
        notification.success({
          message: `Wallet ${wallet.name} created.`,
          description: `Admin created ${wallet.name} wallet for you.`
        });
      }
    },
    {
      name: 'wallet-balance',
      handler: ({ coin, wallet, balance }) => {
        refetch()
        notification.success({
          message: `Wallet ${wallet?.name} balance updated.`,
          description: `Balance for ${coin} updated to ${balance}`
        });
      }
    },
  ];
  useSocketEvents(events);

  const createWallet = async (coin: CoinsType) => {
    if (!user_id) {
      message.error('no user id');
      return;
    }
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