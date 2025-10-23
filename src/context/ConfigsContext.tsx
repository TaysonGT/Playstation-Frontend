import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import currencies from '../assets/currencies.json';
import axios from 'axios';
import toast from 'react-hot-toast';

type CurrencyType = { name: string; symbol: string; symbolNative: string; decimalDigits: number; rounding: number; code: string; namePlural: string; }

type Configs = {
    name: string;
    phone: string;
    currency: CurrencyType;
};

type ConfigsPayload = {
    name: string;
    phone: string;
    currency: string;
};

type ConfigsContextType = {
    configs: Configs;
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
    setCurrency: (currencyCode: string) => boolean;
    updateConfigs: (updated: Partial<ConfigsPayload>) => Promise<void>;
};

const defaultConfigs: Configs = {
    name: '',
    phone: '',
    currency: currencies[0],
};

const ConfigsContext = createContext<ConfigsContextType | undefined>(undefined);

export const ConfigsProvider = ({ children }: { children: ReactNode }) => {
    const [configs, setConfigs] = useState<Configs>(defaultConfigs);

    const fetchConfigs = async () => {
        axios.get('/configs')
        .then(({data})=>{
            if (!data.success) return toast.error(data.message || "حدث خطأ أثناء جلب الإعدادات");
            setConfigs(cfg => ({
                ...defaultConfigs,
                ...data.configs,
                currency: data.configs.currency? currencies.find(c=>c.code === data.configs.currency) : defaultConfigs.currency,
            }));
        })
    };

    useEffect(() => {
        
        fetchConfigs();
    }, []);

    const updateConfigs = async (updated: Partial<ConfigsPayload>) => {
        if((updated.name===configs.name) && (updated.phone === configs.phone) && (updated.currency === configs.currency.code)) {
            toast.error("لا توجد تغييرات لحفظها");
            return
        }

        if(updated.currency){
            const isValid = currencies.some(c => c.code === updated.currency);
            if (!isValid) {
                toast.error("رمز العملة غير صالح");
                return
            }
        }

        axios.put('/configs', {
            ...configs,
            ...updated
        }, {withCredentials:true})
        .then(({data})=>{
            if(!data.success) {
                toast.error(data.message || "حدث خطأ أثناء حفظ الإعدادات");
                return 
            }
            toast.success(data.message)
            fetchConfigs();
        })
    };

    const setName = (name: string) => {
        setConfigs(cfg => ({ ...cfg, name }));
        updateConfigs({ name });
    };
    const setPhone = (phone: string) => {
        setConfigs(cfg => ({ ...cfg, phone }));
        updateConfigs({ phone });
    };
    const setCurrency = (currencyCode: string) => {
        const isValid = currencies.some(c => c.code === currencyCode);
        if (isValid) {
            setConfigs(cfg => ({ ...cfg, currency: currencies.find(c => c.code === currencyCode)! }));
            updateConfigs({ currency: currencyCode });
            return true;
        }
        return false;
    };

    return (
        <ConfigsContext.Provider value={{ configs, setName, setPhone, setCurrency, updateConfigs }}>
            {children}
        </ConfigsContext.Provider>
    );
};

export const useConfigs = () => {
    const context = useContext(ConfigsContext);
    if (!context) {
        throw new Error('useConfigs must be used within a ConfigsProvider');
    }
    return context;
};