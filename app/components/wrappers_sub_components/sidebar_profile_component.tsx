export default function SidebarProfileComponent({src}:{src:string | null | undefined}) { 
    return (
        //ToDo: handle the case where the image isn't available you bitch
      <div className="relative px-2 py-1 rounded-full">
        {/* profile image */}
        <div
          className={`rounded-full w-9 h-9
            transition-all duration-300
            flex justify-center items-center border-2 dark:border-gray-300 border-black bg-background`}
          style={{
            backgroundImage: `url("${src}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    );
}