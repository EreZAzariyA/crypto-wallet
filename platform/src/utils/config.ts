abstract class Config {
  public urls = {
    auth: {
      signup: "",
      signIn: "",
      googleSignIn: "",
      logout: ""
    },
    admin: {
      getUsers: "",
    },
    wallet: {
      createWallet: "",
      getWallets: "",
      sendCoins: "",
    }
  };

  public constructor(baseUrl: string) {
    this.urls = {
      auth: {
        signup: baseUrl + "auth/signup",
        signIn: baseUrl + "auth/signin",
        googleSignIn: baseUrl + "auth/google",
        logout: baseUrl + "auth/logout",
      },
      admin: {
        getUsers: baseUrl + 'admin/get-users'
      },
      wallet: {
        createWallet: baseUrl + 'wallet/create-wallet',
        getWallets: baseUrl +  "wallet/get-wallets",
        sendCoins: baseUrl +  "wallet/send-coins"
      }
    }
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    super("http://localhost:5000/api/");
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super(import.meta.env.VITE_BASE_URL);
  };
};

const config = import.meta.env.PROD ? new ProductionConfig() :  new DevelopmentConfig();
export default config;