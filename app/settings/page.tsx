'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/contexts/ToastContext';
import styles from './SettingsPage.module.css';

interface UserSettings {
  framework: string;
  // Add other settings as needed
}

export default function SettingsPage() {
  const { isLoaded, userId } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({ framework: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchSettings();
    }
  }, [isLoaded, userId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Error fetching settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrameworkChange = (framework: string) => {
    setSettings(prev => ({ ...prev, framework }));
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        showToast('Settings saved successfully', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    }
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <h1>Settings</h1>
      <div className={styles.settingSection}>
        <h2>Framework</h2>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={settings.framework === 'ESX'}
              onChange={() => handleFrameworkChange('ESX')}
            />
            ESX
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.framework === 'QBCore'}
              onChange={() => handleFrameworkChange('QBCore')}
            />
            QBCore
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.framework === 'None'}
              onChange={() => handleFrameworkChange('None')}
            />
            None
          </label>
        </div>
      </div>
      {/* Add other settings sections as needed */}
      <button className={styles.saveButton} onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
}
