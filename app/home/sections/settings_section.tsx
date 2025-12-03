import { Settings, Trash2, Download, RotateCcw, Database } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useExtensionsManager } from "@/contexts/ExtensionManagerContext";
import Icon from "@/app/components/wrappers_sub_components/icon";
import { useRouter } from 'next/navigation';
import SettingsSwitch from "../components/settings/settings_switch";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { useProfile } from "@/contexts/ProfileContext";
import { updateFriendsVisibility, updateProfileVisibility } from "@/services/firebase_services";
import { useAuth } from "@/hooks/useAuth";
import { handleSignOut } from "@/services/auth_services";
import { auth } from "@/lib/firebase";
import costumeToast from "@/components/costume/costume_toast";
import LoadingPinWheel from "@/components/costume/spinner_wheel";

interface SettingSwitch {
  key: string;
  label: string;
  description: string;
}


export default function SettingsSection() {
    const { extensions, loadExtensionsList } = useExtensionsManager()
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
    const router = useRouter();
    const {user} = useAuth()
    const { userProfile, updateCurrentUser, updateAuthState } = useProfile()
    const [profileVisibility, setProfileVisibility] = useState({
        friends_visibility: userProfile?.friends_visibility ?? false,
        profile_visibility: userProfile?.profile_visibility ?? false,
    })
    const settingsConfig: SettingSwitch[] = [
        { key: 'notifications', label: 'Notifications', description: 'Receive app notifications' },
        { key: 'autoUpdate', label: 'Auto Update', description: 'Automatically update extensions' },
    ];

    const [switches, setSwitches] = useState<Record<string, boolean>>({
        notifications: true,
        autoUpdate: false,
        darkMode: false
    });

    const toggleSwitch = (key: string): void => {
        setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const uninstall = async (id: string): Promise<void> => {
        setIsDeletingId(id)
        const res = await window.electronAPI?.uninstallExtension(id)
        if (!res?.success) {
            costumeToast({ content: res?.error, type: "ERROR" })
            return;
        }
        // Reload list on success (instead of manual filter for consistency)
        await loadExtensionsList()
        setIsDeletingId(null)
    };

    const handleChangeFriendsVisibility = async (newState: boolean) => {
        setProfileVisibility(prev => ({
            ...prev,
            friends_visibility: newState
        }))
        const res = await updateFriendsVisibility({ user_id: user!.uid, newState, user })
        if (res.success) {
            let updatedProfile = userProfile!
            updatedProfile.friends_visibility = newState
            updateCurrentUser(updatedProfile)
        }
    }

    const handleChangeProfileVisibility = async (newState: boolean) => {
        setProfileVisibility(prev => ({
            ...prev,
            profile_visibility: newState
        }))
        const res = await updateProfileVisibility({ user_id: user!.uid, newState, user })
        if (res.success) {
            let updatedProfile = userProfile!
            updatedProfile.profile_visibility = newState
            updateCurrentUser(updatedProfile)
        }
    }

    const handleSignOutProcess = async () => {
        const res = await handleSignOut(auth)
        if (res.success) {
            updateAuthState(false)
            updateCurrentUser(null)
            router.push('/signin');
        } else {
            costumeToast({content:res.message, type:"ERROR"})
        }
    }

    return (
        <div className="pl-12 pb-8 max-w-5xl">
            <div className="flex items-center gap-3 mb-8 pl-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
                    <p className="text-sm text-muted-foreground">Manage your application settings</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card className="shadow-none! border-r-transparent! border-l-transparent! rounded-none!">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Profile</CardTitle>
                        <CardDescription>Manage how visible you are on the platform. You can choose whether your profile is publicly viewable and control who can see your friends list.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            <SettingsSwitch setting={{
                                key: "profileVisibility",
                                label: "Profile Visibility",
                                description: "Enable other people to find you through search"
                            }} child={<Switch
                                onCheckedChange={handleChangeProfileVisibility}
                                    checked={profileVisibility.profile_visibility} />} />
                            <SettingsSwitch setting={{
                                key: "friendsVisibility",
                                label: "Friends Visibility",
                                description: "Enable other people to see your friends list"
                            }} child={<Switch
                                onCheckedChange={handleChangeFriendsVisibility}
                                    checked={profileVisibility.friends_visibility} />} />
                            <SettingsSwitch setting={{
                                key: "signout",
                                label: "Sign Out",
                                description: "Sign out from the account"
                            }} child={<Button
                            onClick={handleSignOutProcess}
                            >
                                Sign-Out
                            </Button>} />
                        </div>
                    </CardContent>
                </Card>

                {/* General Settings */}
                <Card className="shadow-none! border-r-transparent! border-l-transparent! border-t-transparent! rounded-none!">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">General</CardTitle>
                        <CardDescription>These settings let you adjust your overall app experience. Choose your preferred theme, decide whether updates should install automatically, and manage how and when you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {settingsConfig.map((setting) => (
                                <div key={setting.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{setting.label}</p>
                                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                                    </div>
                                    <Switch
                                        checked={switches[setting.key]}
                                        onCheckedChange={() => toggleSwitch(setting.key)}
                                    />
                                </div>
                            ))}
                            <SettingsSwitch setting={{
                                key: "darkMode",
                                label: "Dark Mode",
                                description: "Enable dark theme"
                            }} child={<ThemeTogglerButton
                                modes={["light", "dark"]}
                                className="bg-background! text-primary shadow-none rounded-none p-2 
                                hover:bg-accent! transition-all duration-200 "
                                /> }/>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card className="shadow-none! border-none!">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Data Management</CardTitle>
                        <CardDescription>This section provides options for managing your application data, including exporting settings, clearing stored files, and performing a complete reset when needed.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                            <Database className="h-4 w-4" />
                            Clear Cache
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Settings
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Reset All
                        </Button>
                    </CardContent>
                </Card>

                {/* Extensions */}
                <Card className="shadow-none! border-r-transparent! border-l-transparent! border-b-transparent! rounded-none!">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Extensions</CardTitle>
                        <CardDescription>Manage all installed extensions: view details, check version and status, and uninstall any extension you no longer need (<strong>{extensions.length} installed</strong>)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pl-2">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-14"></TableHead>
                            <TableHead>Extension</TableHead>
                            <TableHead className="w-28">Version</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="w-16"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {extensions.map((ext) => (
                            <TableRow key={ext.id}>
                                <TableCell className="text-xl">
                                <Icon src={`/extensions/${ext.id}/icon.svg`} />
                                </TableCell>

                                {/* FIXED NAME TRUNCATION */}
                                <TableCell className="font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {ext.manifest.name}
                                </TableCell>

                                <TableCell className="text-muted-foreground text-sm">
                                {ext.manifest.version}
                                </TableCell>

                                <TableCell>
                                <Badge
                                    variant={ext.manifest.license === "active" ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {ext.manifest.license}
                                </Badge>
                                </TableCell>

                                <TableCell>
                                <Button
                                    variant="ghost"
                                    disabled={ext.id === isDeletingId}
                                    size="icon"
                                    onClick={() => uninstall(ext.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                    {ext.id === isDeletingId ? <LoadingPinWheel size="w-4 h-4" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}