import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Directly include the service account JSON credentials
const serviceAccount: ServiceAccount = {
  projectId: "freelance-17abc",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8piJDutfk2R2C\n4FEl9396bnK2HV0cqjXyDuv4+qc3eK2cOx9iyZvtZaG33mDKqNsckPiW8nw8AhAm\nCBIW22lgD2ceN3Q2t6+uQrYGFp/x2138H+DdoBWpt7IUb8rETdmY69aZ4xkYhl/E\nqyoBcB9BySJ1xrlke+qMJ2+5dKYJH6CGPtBxAXU1WR/gAlELHnqR3n+iLaO7HuNn\nhkAClra2HeiNrjPDYRr56EJwPvWZb17H0ScPNzYj+LBUMz/nMzxVgAktLMM+kPMg\nkF4tiJaipJ/qonwOg4pvIJaym9kGQ8zTpRtgcGjnrYQkuJT2DsG3OR0OwMO249Kb\n+IJPb8C3AgMBAAECggEAD+wnzTaqfT7UDlVXlBBJOrCyzus4jjBRoE4hHaEuVvDB\nGoQk+IYSup1O4oGLAt/wqn8T9E2gLcJw0Xzx5er8AGccaYD9tpaXZepsiaQEOPou\nexbHuH0IBwyho7bx0tLNUGprcQ6pchf5YlSeFYP8p2VOGsm8oR4SZGT5uZn+X5ue\nK1aQf4WnsmwWk/fmjzxefG6hvvUDjVHosY3fnSlEn5ZJgG5kiXarjjCTgr9a8blj\n04z0CuLc4sNanamO2H0Et41nj8Ta1He0Y4Qv3RrWp1H1zWsePerJ0Ubusm1iVWxk\nlf72QvhKtQ8v1RMbHTmUDWsbBSM8PLEzjj7knwXyyQKBgQDfR+UyiLHQaE4FjKJu\nvtt0bkZk5HELt9T27X/WtADR5eG6wD9CERQ8IUPtUdGfUV7swEzMDWEdbNqqIDZT\nO8GHPX4zMYuO3I3pG1Z4GQMxBL8VNHM/qpwvafcu3T9SzEE2U8RAXU59m6Hvn+Ns\nek2g9rgj/dX95Kye08uyX3HYPwKBgQDYSxD8wVASwnSBpOAUUhiwtvIKyx9yw8s7\nBCVRogjXVFLOUN/klSg9Gk7GHt96j8iL5yGE98BmzsFmTbY7FvW2dK2Tv2ZO6OT8\nlsBZTgnLDlpNNewNb+l/KYDgclc8fNoFzxuwag7AN4ZYCpvmiqvBtx/s/7BfZ++A\nogrZPmM5iQKBgQCKwSwOzmHqCJfL3QyoU9UfMtRuKIST6qbe2NLkAzKrPfecTZJC\nJUj04RtMZNcm8bNS32IaQIpEdfwhUylPakgnGjDN8ZEvs6JA5atDsQ+Jq9BvhgvE\n2ep7kJd6uSV799DiyQWhlhqL9maY+jyjkhGh4RCn1TvhrvUTMr1YWPXvkwKBgQCn\nTaFNMSaD7D/8TBE8BqisgEZGzQl9Vy+rbbCELWbTUJlglzQn9qwSX3gRTa4lenRw\nqw7FcHI107XLMU9E86SKRkRBZap4XTNKoj0UlwWCOI7m7E+zsR4Wy36xniAWXKi0\nF5heZBsW2ZwkG8itkhP7GnAqfTjrA1VB1ZW4psZPqQKBgAKUbuNF4c//02hSMbsx\n+7PZltDdYXbBFN8pFxlo6cmxSmJCWst/ok6Gr1lTWvrrbVziqV9gkHhAnQ88JFsv\ndn/ePut8tjQOjwOPZ9F9xzKq3S2n32rxp+Ij07m15wz0ypiki3QvzWafZxExRyRV\nWxit9Xpb1/yZ+71z1Q8CINdh\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-d2eaq@freelance-17abc.iam.gserviceaccount.com"
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();