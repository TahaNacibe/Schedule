export default function SidebarProfileComponent({isOpen}:{isOpen:boolean}) { 
    return (
        <div className="relative px-2 pb-2 pt-1.5 rounded-full">
            {/* profile image */}
            <div className={`rounded-full w-8 h-8
            transition-all duration-300
            flex justify-center items-center border dark:border-white border-black bg-background`}
                style={{
                    backgroundImage: 'url("https://i.pinimg.com/736x/5d/24/9a/5d249a5314bea96ffd923c066cb177ae.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
            }}
            >
            </div>
        </div>
    )
}