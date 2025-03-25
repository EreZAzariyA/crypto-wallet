abstract class Config {
  public urls = {
    auth: {
      signup: "",
      signIn: "",
      googleSignIn: "",
      logout: ""
    },
    wallet: {
      getWallets: "",
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
      wallet: {
        getWallets: baseUrl +  "wallet/get-wallets"
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